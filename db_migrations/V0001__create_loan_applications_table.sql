CREATE TABLE loan_applications (
  id SERIAL PRIMARY KEY,
  minecraft_nickname VARCHAR(255) NOT NULL,
  telegram_username VARCHAR(255) NOT NULL,
  diamond_amount INTEGER NOT NULL,
  loan_period_days INTEGER NOT NULL,
  total_return_amount INTEGER NOT NULL,
  interest_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status ON loan_applications(status);
CREATE INDEX idx_created_at ON loan_applications(created_at DESC);