# NOTES & KNOWN SIMPLIFICATIONS — Spark MVP

### Architectural Decisions & Simplifications
1. **Live-Computed Tier Scorer (Section 6.8)**: Rather than running a background weekly scheduled scoring job, the tier progress is calculated live from the student's message count and average substantive message length in `circle_messages` on `/journey` load.
2. **Demo University Match (Section 6.2)**: University domain verification is simulated during signup via a dropdown selector of seeded partner institutions.
3. **Admin Dashboard Privacy (Section 6.10)**: `/admin` view displays aggregate metrics and Recharts visualizations only. No student PII or raw message streams are rendered on this route.
