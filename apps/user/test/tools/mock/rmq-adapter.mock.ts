import { v4 as uuidv4 } from 'uuid';

export class RMQAdapterMock {
  sendMessage = jest.fn().mockResolvedValue({
    id: `${Math.floor(Math.random() * 1_000_000)}`,
    url: `https://example.com/uploads/${uuidv4()}.png`,
  });
}
