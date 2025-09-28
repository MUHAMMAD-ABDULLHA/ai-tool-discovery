import React from "react";
import ToolForm from "./ToolForm";
import Tools from "../../hooks/Tools";
import AuthStore from "../../store/AuthStore"; // assume you keep token here

const ToolPage = () => {
  const { createTool } = Tools();
  const { token } = AuthStore(); // 🔐 your auth store with JWT

  const handleCreateTool = async (toolData) => {
    try {
      await createTool(toolData, token);
      alert("Tool created successfully!");
    } catch (err) {
      alert("Failed to create tool", err);
    }
  };

  return <ToolForm onSubmit={handleCreateTool} token={token} />;
};

export default ToolPage;
