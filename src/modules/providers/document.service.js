'use strict';

const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/AppError');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const DOC_SELECT = {
  id: true, documentType: true, documentUrl: true,
  status: true, adminNotes: true, reviewedAt: true,
  createdAt: true, updatedAt: true,
};

// Resolve providerId from userId
const getProviderId = async (userId) => {
  const pp = await prisma.providerProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!pp) {throw new AppError('Provider profile not found.', StatusCodes.NOT_FOUND);}
  return pp.id;
};

// Assert ownership: document must belong to this provider
const assertDocumentOwnership = async (docId, providerId) => {
  const doc = await prisma.providerDocument.findUnique({ where: { id: docId }, select: { id: true, providerId: true } });
  if (!doc) {throw new AppError('Document not found.', StatusCodes.NOT_FOUND);}
  if (doc.providerId !== providerId) {throw new AppError('You do not have permission to access this document.', StatusCodes.FORBIDDEN);}
  return doc;
};

const getDocuments = async (userId) => {
  const providerId = await getProviderId(userId);
  return prisma.providerDocument.findMany({
    where: { providerId },
    select: DOC_SELECT,
    orderBy: { createdAt: 'desc' },
  });
};

const createDocument = async (userId, payload) => {
  const providerId = await getProviderId(userId);
  const { documentType, documentUrl } = payload;
  return prisma.providerDocument.create({
    data: { providerId, documentType, documentUrl, status: 'PENDING' },
    select: DOC_SELECT,
  });
};

const deleteDocument = async (userId, docId) => {
  const providerId = await getProviderId(userId);
  const doc = await assertDocumentOwnership(docId, providerId);
  if (doc.status === 'APPROVED') {
    throw new AppError('Approved documents cannot be deleted. Contact support.', StatusCodes.UNPROCESSABLE_ENTITY);
  }
  await prisma.providerDocument.delete({ where: { id: docId } });
};

module.exports = { getDocuments, createDocument, deleteDocument };
