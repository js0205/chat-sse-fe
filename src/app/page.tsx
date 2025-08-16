import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🤖 AI 聊天助手</h1>
      <p>欢迎使用 AI 聊天应用</p>
      <div style={{ marginTop: '20px' }}>
        <Link
          href='/en/chat'
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          英文聊天
        </Link>
        <Link
          href='/zh/chat'
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          中文聊天
        </Link>
      </div>
    </div>
  );
}
