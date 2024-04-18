async function postExample(name) {
    let data = {'name': name};
    await fetch('/example/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}