export async function DataFetcher() {
  const user = {
    name: "Roman",
    complexity: 0
  }

  if (process.env.BASE_URL !== undefined) {
    try {
      const result = await fetch (`${process.env.BASE_URL}/init`, {     
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      return result;
    } catch (error) {
      console.log(error);
    }
 }
}