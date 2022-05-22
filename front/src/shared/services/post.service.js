const BASE_URL = "/api/post";

export async function createPost(postForm) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(postForm),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log(response);
    } else {
      throw await response.json();
    }
  } catch (e) {
    throw e;
  }
}

export async function test() {
  return await (await fetch(`${BASE_URL}`)).json();
}
