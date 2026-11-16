export interface KycSubmission {
  vendorId: string;
  businessName: string;
  legalEntityType: string;
  registrationNumber: string;
  taxIdentificationNumber?: string;
  beneficialOwners: Array<{
    fullName: string;
    dateOfBirth: string;
    bvnOrNin?: string;
  }>;
}

export interface KycVerificationResult {
  kycReference: string;
  status: 'pending' | 'verified' | 'rejected';
  confidenceScore: number;
  reason?: string;
}

export interface KycProvider {
  submitBusinessVerification(submission: KycSubmission): Promise<KycVerificationResult>;
  checkStatus(kycReference: string): Promise<KycVerificationResult>;
}

export class MockKycProvider implements KycProvider {
  public async submitBusinessVerification(
    submission: KycSubmission
  ): Promise<KycVerificationResult> {
    const kycReference = `KYC-REF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // Rejection simulation for testing
    if (submission.registrationNumber === 'REJECT_ME') {
      return {
        kycReference,
        status: 'rejected',
        confidenceScore: 0.1,
        reason: 'Invalid registration certificate number or mismatched corporate registry records.',
      };
    }

    // Default auto-verification for sandbox
    return {
      kycReference,
      status: 'verified',
      confidenceScore: 0.98,
    };
  }

  public async checkStatus(kycReference: string): Promise<KycVerificationResult> {
    return {
      kycReference,
      status: 'verified',
      confidenceScore: 0.98,
    };
  }
}
