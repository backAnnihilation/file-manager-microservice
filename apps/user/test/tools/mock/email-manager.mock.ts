export class EmailManagerMock {
  async sendEmailConfirmationMessage(): Promise<void> {
    await Promise.resolve();
  }
  async sendEmailRecoveryMessage(): Promise<void> {
    await Promise.resolve();
  }
}

export class EmailMockService {
  sendEmailConfirmationMessage(
    email: string,
    confirmationCode: string,
  ): Promise<any> {
    return Promise.resolve({ confirmationCode, email });
  }

  sendEmailRecoveryMessage(email: string, recoveryCode: string): Promise<any> {
    return Promise.resolve(recoveryCode);
  }
}

export class EmailAdapterMock {
  sendEmail = jest.fn().mockResolvedValue({});
}
