import re

with open('src/components/sections/Services.tsx', 'r') as f:
    code = f.read()

# Update categoryImages
old_cat = """const categoryImages: Record<string, string> = {
  Hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  Makeup: 'https://images.unsplash.com/photo-1487412949317-9a1e063e613a?w=600&q=80',
  Nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  'Skin & Body': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80',
  'Bridal Packages': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'Party Packages': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
};"""

new_cat = """const categoryImages: Record<string, string> = {
  Hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  'Party Makeup': 'https://images.unsplash.com/photo-1487412949317-9a1e063e613a?w=600&q=80',
  'Engagement Makeup': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'Bridal Makeup': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  Nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80',
  'Skin & Body': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d880?w=600&q=80',
};"""

code = code.replace(old_cat, new_cat)

# Add explicit mappings for the new service names to local assets
old_svc = """const serviceImages: Record<string, string> = {
  'Hair Styling': IMAGES.new_hair_styling,"""

new_svc = """const serviceImages: Record<string, string> = {
  'Hair Styling': IMAGES.new_hair_styling,
  'Party Makeup (Normal)': IMAGES.after3,
  'Party Makeup (HD)': IMAGES.party1,
  'Party Makeup (Silicone)': IMAGES.after4,
  'Engagement Makeup (Normal)': IMAGES.after2,
  'Engagement Makeup (HD)': IMAGES.before3,
  'Engagement Makeup (Silicone)': IMAGES.before1,
  'Bridal & Reception (Normal)': IMAGES.new_bridal_makeup,
  'Bridal & Reception (HD)': IMAGES.bridal,
  'Bridal & Reception (Silicone)': IMAGES.new_bridal_package,"""

code = code.replace(old_svc, new_svc)

with open('src/components/sections/Services.tsx', 'w') as f:
    f.write(code)
