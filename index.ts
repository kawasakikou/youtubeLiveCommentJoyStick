async function main() {
  console.log('hello');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
