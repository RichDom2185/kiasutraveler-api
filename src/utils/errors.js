export const errorBadRequest = res => {
  res.status(400);
  res.json({ error: "Bad Request" });
};

export const errorUnprocessableEntity = res => {
  res.status(422);
  res.json({ error: "Unprocessable Entity" });
};
