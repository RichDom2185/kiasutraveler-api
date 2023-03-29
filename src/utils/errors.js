export const errorUnprocessableEntity = res => {
  res.status(422);
  res.json({ error: "Unprocessable Entity" });
};
