export async function saveOnboarding(formData) {
  const res = await fetch('/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      goals: formData.goals,
      activityLevel: formData.activityLevel, // nullable, skippable
      dob: formData.dob, // nullable, skippable
      gender: formData.gender, // nullable, skippable
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Could not save onboarding data.');
  }

  return res.json();
}
