-- Add audit_logs table for admin action tracking
-- This migration adds the audit_logs table to track administrative actions

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  details TEXT,
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS audit_logs_admin_idx ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS audit_logs_target_user_idx ON audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;
CREATE POLICY "Admins can view all audit logs" ON audit_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role = 'admin')
);
CREATE POLICY "System can create audit logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);