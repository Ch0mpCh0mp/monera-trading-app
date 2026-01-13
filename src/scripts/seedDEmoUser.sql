
-- Demo User für Tests
INSERT INTO users (username, email, password_hash)
VALUES ('Demo User', 'demo@user.com', '$2b$10$G9/FMVE5ibVGAF5m9l/gF.K/QeZ4RtVmnB7g97NbJJA0rhVPX8tJy')
ON CONFLICT (email) DO NOTHING;
