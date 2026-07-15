'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const updateDocumentStatus = async (docId, status, adminNotes) => {
  const doc = await prisma.providerDocument.findUnique({ where: { id: docId } });
  if (!doc) {throw new AppError('Document not found', StatusCodes.NOT_FOUND);}

  return prisma.$transaction(async (tx) => {
    const updatedDoc = await tx.providerDocument.update({
      where: { id: docId },
      data: { status, adminNotes },
    });

    // Check if provider has all docs approved. If so, auto-verify profile.
    if (status === 'APPROVED') {
      const allDocs = await tx.providerDocument.findMany({
        where: { providerId: doc.providerId }
      });
      
      const allApproved = allDocs.length > 0 && allDocs.every(d => d.status === 'APPROVED');
      if (allApproved) {
        await tx.providerProfile.update({
          where: { id: doc.providerId },
          data: { verificationStatus: 'APPROVED' }
        });
      }
    } else if (status === 'REJECTED') {
      await tx.providerProfile.update({
        where: { id: doc.providerId },
        data: { verificationStatus: 'REJECTED' }
      });
    }

    return updatedDoc;
  });
};

const resolveDispute = async (disputeId, resolution) => {
  const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) {throw new AppError('Dispute not found', StatusCodes.NOT_FOUND);}
  if (dispute.status === 'RESOLVED') {throw new AppError('Dispute is already resolved', StatusCodes.UNPROCESSABLE_ENTITY);}

  return prisma.dispute.update({
    where: { id: disputeId },
    data: {
      status: 'RESOLVED',
      resolution,
      resolvedAt: new Date(),
    },
  });
};

module.exports = {
  updateDocumentStatus,
  resolveDispute,
};
