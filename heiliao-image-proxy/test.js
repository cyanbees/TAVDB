export default {
  async fetch(request) {
    return new Response('Hello from heiliao-cover-proxy!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
