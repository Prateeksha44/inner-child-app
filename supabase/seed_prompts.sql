-- Run after schema.sql. A starter library so the app is testable end to end.
-- Expand this freely later — tags should match the onboarding tag options
-- defined in app/onboarding/page.tsx (TAGS array).

insert into public.prompts (text, tags) values
  ('Draw something using only your non-dominant hand for 5 minutes.', array['art']),
  ('Finger-paint or doodle with whatever''s around — no plan, just color.', array['art']),
  ('Make up a comic strip about your day, stick figures totally allowed.', array['art', 'pretend_play']),
  ('Fold 5 paper airplanes and see which one flies the farthest.', array['building']),
  ('Build the tallest tower you can out of whatever''s on your desk.', array['building']),
  ('Build a blanket fort and sit inside it for 10 minutes, no phone.', array['building', 'pretend_play']),
  ('Go outside and find 5 things you''ve never noticed before on your usual route.', array['outdoors']),
  ('Lie on the grass and find shapes in the clouds for 10 minutes.', array['outdoors']),
  ('Skip, don''t walk, to get somewhere today.', array['outdoors', 'movement']),
  ('Do 20 jumping jacks then freeze-dance to one song.', array['movement']),
  ('Try to do a cartwheel (or just attempt one) in a safe open space.', array['movement']),
  ('Hopscotch — draw one with chalk or tape and play a round.', array['movement', 'outdoors']),
  ('Make up a silly voice and narrate the next 10 minutes of your life like a nature documentary.', array['pretend_play']),
  ('Have a 5-minute conversation with a stuffed animal, plant, or pet like it can talk back.', array['pretend_play', 'animals']),
  ('Build a pillow fort battle station and defend it from an imaginary invader for 10 minutes.', array['pretend_play', 'building']),
  ('Put on a song from when you were a kid and sing it at full volume.', array['music']),
  ('Make an instrument out of household objects and play a 30-second song.', array['music']),
  ('Freestyle rap or hum a made-up tune about your day.', array['music']),
  ('Watch an animal (pet, bird, squirrel, anything) for 10 minutes and narrate what you think it''s thinking.', array['animals']),
  ('Draw a portrait of an animal from memory — accuracy doesn''t count, effort does.', array['animals', 'art']),
  ('Look up one weird animal fact and tell someone about it today.', array['animals']),
  ('Do a jigsaw or crossword puzzle for 15 minutes, no phone nearby.', array['puzzles']),
  ('Try to solve a Rubik''s cube (or one face of it) for 10 minutes.', array['puzzles']),
  ('Play a round of tic-tac-toe or hangman with someone, on actual paper.', array['puzzles']),
  ('Bake or cook something you loved eating as a kid — simple counts.', array['cooking']),
  ('Make a weird snack combo you would''ve been proud of at age 8.', array['cooking']),
  ('Decorate a plain snack (toast, fruit, anything) like it''s a tiny art project.', array['cooking', 'art']),
  ('Climb something safe and low — a low wall, a big rock, a sturdy tree stump.', array['outdoors', 'movement']),
  ('Make a paper fortune teller (cootie catcher) and use it on someone.', array['building', 'pretend_play']),
  ('Blow bubbles (real ones, with soap) for 10 minutes outside.', array['outdoors', 'pretend_play'])
on conflict do nothing;
