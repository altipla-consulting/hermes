
export default {
  template: `
    <div>
      <h1>Throw Error View</h1>
    </div>
  `,

  navigate() {
    return new Promise((resolve, reject) => {
      reject('foo error');
    });
  },
}
