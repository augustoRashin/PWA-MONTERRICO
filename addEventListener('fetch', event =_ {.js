addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const locationData = await fetch(`https://api.ipdata.co/${ipData.ip}?api-key=YOUR_API_KEY`);
    const locationResult = await locationData.json();

    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString();

    const data = await request.json();

    data.location = {
        city: locationResult.city,
        region: locationResult.region,
        country: locationResult.country_name,
        latitude: locationResult.latitude,
        longitude: locationResult.longitude
    };
    data.currentTime = currentTime;

    const newUser = new User(data);

    newUser.save((err, user) => {
        if (err) {
            return new Response('Error al registrar el usuario.', { status: 500 });
        } else {
            return new Response('Usuario registrado correctamente.', { status: 200 });
        }
    });
}