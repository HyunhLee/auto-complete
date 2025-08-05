import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 검색어 입력 시 자동완성 API 호출
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '' || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`https://api-dev.balhea.kr/ctg_spec/search?keyword=${encodeURIComponent(query)}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('자동완성 API 에러:', err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300); // 300ms 딜레이
    return () => clearTimeout(debounce);
  }, [query]);

  // 제안 항목 클릭 시 상세 API 호출
  const handleSelect = async (item: any) => {
    setQuery(item);
    setSuggestions([]);
    setLoading(true);

    try {
      const res = await axios.get(`https://api-dev.balhea.kr/ctg_spec/template?ctg=${encodeURIComponent(item[2])}`);
      setSelectedResult(res.data);
    } catch (err) {
      console.error('상세 API 에러:', err);
      setSelectedResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어 입력..."
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />

      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', marginTop: 0, padding: '0', listStyle: 'none', maxHeight: '150px', overflowY: 'auto' }}>
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '20px' }}>
        {loading && <p>로딩 중...</p>}
        {selectedResult && (
          <div>
            <h3>검색 결과</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(selectedResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;