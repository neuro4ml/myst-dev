# Configuration file for the Sphinx documentation builder.

project = 'Custom-Theme'
copyright = '2024, Josh Gavin'
author = 'Josh Gavin'
release = ''

extensions = ['myst_parser']

myst_enable_extensions = [
    "dollarmath",
    "amsmath",
    "deflist",
    "html_admonition",
    "html_image",
    "colon_fence",
    "smartquotes",
    "replacements",
    "linkify",
    "substitution",
    "tasklist",
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

html_theme = 'two_columns_new'
html_theme_path = ['_themes']
html_static_path = ['_static']
