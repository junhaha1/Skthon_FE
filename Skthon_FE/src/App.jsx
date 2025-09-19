import './App.css'

function App() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        셰어하우스 피그마 디자인
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <iframe 
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '8px' }} 
          width="800" 
          height="450" 
          src="https://embed.figma.com/design/p28BUEV2HOilQhfAAdxvH4/%EC%89%90%EC%96%B4%ED%95%98%EC%9A%B0%EC%8A%A4-%ED%94%BC%EA%B7%B8%EB%A7%88?node-id=26-50&embed-host=share" 
          allowFullScreen
          title="셰어하우스 피그마 디자인"
        />
      </div>
    </div>
  )
}

export default App
