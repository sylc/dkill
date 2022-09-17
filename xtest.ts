



Deno.test('ss', async () => {

  const a = [
    {
      pid: 1,
      bool: true }
  ]
  const f = () => a
  console.table(await f())


})