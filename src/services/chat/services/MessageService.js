import Message from "../model/MessageModel.js";

export const saveMessage = async (data) => {
    return await Message.create(data);
};

export const getMessagesByRoom = async (room) => {
    return await Message
        .find({ room })
        .sort({ createdAt: 1 })
        .populate("sender", "name email");
};
