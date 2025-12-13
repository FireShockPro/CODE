document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.guests !== undefined) data.guests = Number(data.guests);
  try {
    const res = await fetch('/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    const status = document.getElementById('status');
    if (json && json.ok) {
      status.style.color = 'green';
      status.textContent = 'Thanks — your RSVP was received.';
      form.reset();
    } else {
      status.style.color = 'crimson';
      status.textContent = 'Sorry, there was a problem sending your RSVP.';
    }
  } catch (err) {
    const status = document.getElementById('status');
    status.style.color = 'crimson';
    status.textContent = 'Network error — try again later.';
  }
});
