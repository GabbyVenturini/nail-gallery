fetch("http://localhost:3001/api/products")
  .then(res => res.json())
  .then(data => console.log(`Produtos retornados da API: ${data.length}`))
  .catch(console.error);
