'use client';
import { ChatBox } from '@/components/ChatBox/ChatBox';
import { ModelBox } from '@/components/ModelBox/ModelBox';
import { Button, Modal } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatPageClientProps {
  lng: string;
}

export function ChatPageClient({ lng }: ChatPageClientProps) {
  const { t } = useTranslation();
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
      <p className='text-sm text-gray-500 mb-4'>当前语言: {lng}</p>
      <Button onClick={showDialog}>{t('login')}</Button>
      <Modal
        title={t('login')}
        visible={visible}
        onOk={handleOk}
        afterClose={handleAfterClose}
        onCancel={handleCancel}
        closeOnEsc={true}
      >
        {t('This is the content of a basic modal.')}
        <br />
        {t('More content...')}
      </Modal>
      <h1>{t('choose model')}</h1>
      <ModelBox />
      <h1>{t('Chat Page')}</h1>
      <ChatBox />
    </div>
  );
}
