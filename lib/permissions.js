ownsDocument = function ownsDocument(userId, doc) {
  return doc && doc.userId === userId;
};