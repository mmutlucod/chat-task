export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'secret-key'
  } as const;