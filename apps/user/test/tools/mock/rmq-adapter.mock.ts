export class RMQAdapterMock {
  sendMessage = jest.fn().mockResolvedValue({
    id: `${Math.floor(Math.random() * 1_000_000)}`,
    url: `${Math.floor(Math.random() * 1_000_000)}`,
  });
}
