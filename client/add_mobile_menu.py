import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    code = f.read()

# 1. Add Menu icon to lucide-react imports
if 'Menu' not in code:
    code = code.replace('Trash2,', 'Trash2, Menu,')

# 2. Add mobileMenuOpen state
if 'mobileMenuOpen' not in code:
    code = code.replace('const [activeTab, setActiveTab] = useState(\'dashboard\');', 'const [activeTab, setActiveTab] = useState(\'dashboard\');\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);')

# 3. Add mobile header and modify sidebar visibility
old_sidebar = """      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gold/20 bg-charcoal p-6 lg:block">"""

new_sidebar = """      {/* Sidebar Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gold/20 bg-charcoal p-6 transition-transform duration-300 ease-in-out lg:static lg:block lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileMenuOpen(false)} className="absolute right-4 top-4 text-cream/60 lg:hidden"><X size={24} /></button>"""
code = code.replace(old_sidebar, new_sidebar)

# 4. Modify tab click to close mobile menu
code = code.replace('onClick={() => setActiveTab(tab.id)}', 'onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}')

# 5. Add mobile header before <main>
old_main = """      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">"""

new_main = """      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-gold/10 bg-charcoal p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-sm font-bold text-gold">B</div>
            <span className="font-display font-semibold text-gold">Beauty Hub Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="text-gold"><Menu size={24} /></button>
        </div>
        <div className="p-4 md:p-8">"""

code = code.replace(old_main, new_main)

# Close the new div around the main content (because we added <div className="p-4 md:p-8">)
# Find the end of main. It's `      </main>\n    </div>`
old_end = """      </main>
    </div>"""
new_end = """        </div>
      </main>
    </div>"""
code = code.replace(old_end, new_end)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(code)
