import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    code = f.read()

# 1. Update imports
if 'updateService' not in code:
    code = code.replace('createService,', 'createService, updateService,')
if 'Edit' not in code:
    code = code.replace('Trash2,', 'Trash2, Edit,')

# 2. Add state
if 'editingServiceId' not in code:
    code = code.replace(
        "const [newService, setNewService] = useState({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });",
        "const [newService, setNewService] = useState({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });\n  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);"
    )

# 3. Update handleAddService
old_handle = """  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(newService).forEach(([k, v]) => fd.append(k, v));
    try {
      await createService(fd);
      toast.success('Service added!');
      setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });
      loadData();
    } catch { toast.error('Failed to add service'); }
  };"""

new_handle = """  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(newService).forEach(([k, v]) => fd.append(k, String(v)));
    try {
      if (editingServiceId) {
        await updateService(editingServiceId, fd);
        toast.success('Service updated!');
        setEditingServiceId(null);
      } else {
        await createService(fd);
        toast.success('Service added!');
      }
      setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' });
      loadData();
    } catch { toast.error('Failed to save service'); }
  };"""

code = code.replace(old_handle, new_handle)

# 4. Update the form buttons and title
old_form_title = '<h3 className="mb-4 flex items-center gap-2 font-semibold text-gold"><Plus size={18} /> Add New Service</h3>'
new_form_title = '<h3 className="mb-4 flex items-center gap-2 font-semibold text-gold">{editingServiceId ? <Edit size={18} /> : <Plus size={18} />} {editingServiceId ? "Edit Service" : "Add New Service"}</h3>'
code = code.replace(old_form_title, new_form_title)

old_submit_btn = '<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary mt-4 text-sm !py-3 px-8">Save Service</motion.button>'
new_submit_btn = """<div className="flex gap-4 items-center mt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary text-sm !py-3 px-8">
                      {editingServiceId ? 'Update Service' : 'Save Service'}
                    </motion.button>
                    {editingServiceId && (
                      <button type="button" onClick={() => { setEditingServiceId(null); setNewService({ name: '', category: 'Hair', price: '', duration: '', description: '', image: '' }); }} className="text-sm text-cream/60 hover:text-gold transition">Cancel</button>
                    )}
                  </div>"""
code = code.replace(old_submit_btn, new_submit_btn)

# 5. Add Edit button to the service mapping
old_map = """                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteService(s._id).then(() => { toast.success('Deleted'); loadData(); })} className="text-red-400 p-2 hover:bg-red-400/10 rounded-full"><Trash2 size={18} /></motion.button>"""

new_map = """                      <div className="flex gap-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setEditingServiceId(s._id); setNewService({ name: s.name, category: s.category, price: String(s.price), duration: String(s.duration), description: s.description || '', image: s.image || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-gold p-2 hover:bg-gold/10 rounded-full"><Edit size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteService(s._id).then(() => { toast.success('Deleted'); loadData(); })} className="text-red-400 p-2 hover:bg-red-400/10 rounded-full"><Trash2 size={18} /></motion.button>
                      </div>"""
code = code.replace(old_map, new_map)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(code)
