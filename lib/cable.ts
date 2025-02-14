import { createConsumer } from "@rails/actioncable";

const createCable = (token: string) => {
  return createConsumer(`ws://localhost:3000/cable?token=${token}`);
};

export default createCable;
