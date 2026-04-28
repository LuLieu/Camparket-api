export function serializeListing(listing) {
  if (!listing) return listing;
  return {
    ...listing,
    price: listing.price === undefined ? listing.price : Number(listing.price),
  };
}

export function serializeUser(user) {
  if (!user) return user;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}
