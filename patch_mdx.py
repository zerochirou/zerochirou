import os
import re

files = {
    'clickfor.mdx': '/assets/icons/clickfor.png',
    'hypergrid.mdx': '/assets/icons/hyperg.png',
    'devinion.mdx': '/favicon.ico',
    'zensekit.mdx': '/favicon.ico',
    'rhea.mdx': '/favicon.ico'
}

for filename, url in files.items():
    path = os.path.join('content/projects', filename)
    with open(path, 'r') as f:
        content = f.read()
    
    # insert logoUrl before techStack
    new_content = re.sub(r'techStack:', f'logoUrl: "{url}"\ntechStack:', content)
    
    with open(path, 'w') as f:
        f.write(new_content)

print("Updated frontmatters.")
