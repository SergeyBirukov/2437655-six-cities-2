export interface IsDocumentExistsInterface {
  isExists(documentId: string): Promise<boolean>;
}
