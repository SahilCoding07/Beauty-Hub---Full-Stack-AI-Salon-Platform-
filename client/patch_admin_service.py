import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    code = f.read()

# 1. Update the state to include an imageBase64
old_state = "const [newService, setNewService] = useState({ name: '', category: 'Hair Styling', price: '', duration: '', description: '' });"
new_state = "const [newService, setNewService] = useState({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });"
code = code.replace(old_state, new_state)

# 2. Update the handleAddService to reset image
old_reset = "setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '' });"
new_reset = "setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });"
code = code.replace(old_reset, new_reset)

# 3. Add a file input to the form
old_category_select = """                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none"
                    >
                      {['Hair Styling', 'Bridal Makeup', 'Nail Art', 'Skin Care', 'Party Packages', 'Bridal Packages'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>"""

new_category_select = """                    <select
                      value={newService.category}
                      onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                      className="rounded-xl border border-beige/20 bg-ink/50 px-4 py-3 text-cream focus:border-gold focus:outline-none"
                    >
                      {['Hair', 'Bridal Makeup', 'Engagement Makeup', 'Party Makeup', 'Nails', 'Skin & Body'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-gold">Service Image (Optional)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewService({ ...newService, image: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-sm text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold/20 file:text-gold hover:file:bg-gold/30 cursor-pointer"
                      />
                    </div>"""

code = code.replace(old_category_select, new_category_select)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(code)
