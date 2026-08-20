-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  profile_image_url TEXT,
  role VARCHAR(50) DEFAULT 'agent' NOT NULL CHECK (role IN ('admin', 'coordinator', 'agent', 'attachment')),
  approval_status VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  service_number VARCHAR(255),
  mobile VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  atoll VARCHAR(255) NOT NULL,
  island VARCHAR(255) NOT NULL,
  event_location TEXT,
  waiting_location TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  waiting_latitude NUMERIC(10,7),
  waiting_longitude NUMERIC(10,7),
  event_date TIMESTAMPTZ,
  contact VARCHAR(255),
  comment TEXT,
  status VARCHAR(50) DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled', 'archived')),
  created_by VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_count INTEGER DEFAULT 0 NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS events_status_idx ON events(status);
CREATE INDEX IF NOT EXISTS events_atoll_idx ON events(atoll);
CREATE INDEX IF NOT EXISTS events_created_by_idx ON events(created_by);

-- Islands table
CREATE TABLE IF NOT EXISTS islands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  atoll VARCHAR(255) NOT NULL,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  is_visited BOOLEAN DEFAULT FALSE NOT NULL,
  last_visited TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS islands_atoll_idx ON islands(atoll);
CREATE INDEX IF NOT EXISTS islands_name_idx ON islands(name);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_participants_event_idx ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS event_participants_user_idx ON event_participants(user_id);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  status VARCHAR(50) DEFAULT 'available' NOT NULL CHECK (status IN ('available', 'in-use', 'maintenance', 'damaged', 'transferred')),
  atoll VARCHAR(255) NOT NULL,
  island VARCHAR(255),
  description TEXT,
  condition VARCHAR(50) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  parent_equipment_id VARCHAR(255),
  created_by VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_atoll_idx ON equipment(atoll);
CREATE INDEX IF NOT EXISTS equipment_island_idx ON equipment(island);
CREATE INDEX IF NOT EXISTS equipment_type_idx ON equipment(type);

-- Equipment transfers table
CREATE TABLE IF NOT EXISTS equipment_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  destination_equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  quantity_moved INTEGER NOT NULL,
  from_atoll VARCHAR(255) NOT NULL,
  from_island VARCHAR(255),
  to_atoll VARCHAR(255) NOT NULL,
  to_island VARCHAR(255),
  transferred_by VARCHAR(255) NOT NULL REFERENCES users(id),
  transferred_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS equipment_transfers_source_idx ON equipment_transfers(source_equipment_id);
CREATE INDEX IF NOT EXISTS equipment_transfers_dest_idx ON equipment_transfers(destination_equipment_id);

-- Equipment audit log table
CREATE TABLE IF NOT EXISTS equipment_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  field_name VARCHAR(255),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(255) NOT NULL REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS equipment_audit_log_equipment_idx ON equipment_audit_log(equipment_id);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  message TEXT,
  audio_url TEXT,
  is_audio BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);

-- User chat read status table
CREATE TABLE IF NOT EXISTS user_chat_read_status (
  user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_read_message_id UUID,
  last_read_created_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Island visits table
CREATE TABLE IF NOT EXISTS island_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  island_id UUID NOT NULL REFERENCES islands(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visit_type VARCHAR(50) DEFAULT 'automatic' NOT NULL CHECK (visit_type IN ('manual', 'automatic')),
  visited_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notes TEXT,
  UNIQUE(user_id, island_id)
);

CREATE INDEX IF NOT EXISTS island_visits_user_id_idx ON island_visits(user_id);
CREATE INDEX IF NOT EXISTS island_visits_island_id_idx ON island_visits(island_id);

-- Island visit equipment junction table
CREATE TABLE IF NOT EXISTS island_visit_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES island_visits(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  UNIQUE(visit_id, equipment_id)
);

-- User milestones table
CREATE TABLE IF NOT EXISTS user_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  milestone_type VARCHAR(50) NOT NULL CHECK (milestone_type IN ('island_visits', 'atolls_visited')),
  milestone_name VARCHAR(255) NOT NULL,
  milestone_level INTEGER NOT NULL,
  description TEXT NOT NULL,
  badge_icon VARCHAR(50) NOT NULL,
  badge_color VARCHAR(50) NOT NULL,
  progress INTEGER DEFAULT 0 NOT NULL,
  target_value INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ,
  UNIQUE(user_id, milestone_type, milestone_level)
);

CREATE INDEX IF NOT EXISTS user_milestones_user_id_idx ON user_milestones(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE island_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE island_visit_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestones ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users are viewable by authenticated users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid()::text = id);

-- Events policies
CREATE POLICY "Events are viewable by authenticated users" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own events" ON events FOR UPDATE TO authenticated USING (auth.uid()::text = created_by);
CREATE POLICY "Admins can delete events" ON events FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role = 'admin')
);

-- Islands policies
CREATE POLICY "Islands are viewable by authenticated users" ON islands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage islands" ON islands FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role = 'admin')
);

-- Event participants policies
CREATE POLICY "Event participants viewable by authenticated users" ON event_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can join events" ON event_participants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can leave events" ON event_participants FOR DELETE TO authenticated USING (auth.uid()::text = user_id);

-- Equipment policies
CREATE POLICY "Equipment viewable by authenticated users" ON equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create equipment" ON equipment FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update equipment" ON equipment FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins and coordinators can delete equipment" ON equipment FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role IN ('admin', 'coordinator'))
);

-- Equipment transfers policies
CREATE POLICY "Transfers viewable by authenticated users" ON equipment_transfers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create transfers" ON equipment_transfers FOR INSERT TO authenticated WITH CHECK (true);

-- Equipment audit log policies
CREATE POLICY "Audit log viewable by authenticated users" ON equipment_audit_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create audit entries" ON equipment_audit_log FOR INSERT TO authenticated WITH CHECK (true);

-- Chat messages policies
CREATE POLICY "Chat messages viewable by authenticated users" ON chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can send messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Admins can delete messages" ON chat_messages FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role = 'admin')
);

-- User chat read status policies
CREATE POLICY "Users can view own read status" ON user_chat_read_status FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own read status" ON user_chat_read_status FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own read status" ON user_chat_read_status FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);

-- Island visits policies
CREATE POLICY "Island visits viewable by authenticated users" ON island_visits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create visits" ON island_visits FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);

-- Island visit equipment policies
CREATE POLICY "Visit equipment viewable by authenticated users" ON island_visit_equipment FOR SELECT TO authenticated USING (true);

-- User milestones policies
CREATE POLICY "Users can view own milestones" ON user_milestones FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "Admins can view all milestones" ON user_milestones FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role = 'admin')
);
CREATE POLICY "System can create milestones" ON user_milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage milestones" ON user_milestones FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid()::text AND users.role = 'admin')
);
