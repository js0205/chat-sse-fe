'use client';
import { ChatBox } from '@/components/ChatBox/ChatBox';
import { ModelBox } from '@/components/ModelBox/ModelBox';
import { Button, Modal } from '@douyinfe/semi-ui';
import { useState } from 'react';

export default function ChatPage() {
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
    console.log('Ok button clicked');
  };
  const handleCancel = () => {
    setVisible(false);
    console.log('Cancel button clicked');
  };
  const handleAfterClose = () => {
    console.log('After Close callback executed');
  };
  return (
    <div>
      <Button onClick={showDialog}>登录</Button>
      <Modal
        title='基本对话框'
        visible={visible}
        onOk={handleOk}
        afterClose={handleAfterClose}
        onCancel={handleCancel}
        closeOnEsc={true}
      >
        This is the content of a basic modal.
        <br />
        More content...
      </Modal>
      <h1>选择模型</h1>
      <ModelBox />
      <h1>Chat Page</h1>
      <ChatBox />
    </div>
  );
}
