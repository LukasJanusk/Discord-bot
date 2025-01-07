import app from './app';

const PORT = 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`server is running at http://localhost:${PORT}`);
});
