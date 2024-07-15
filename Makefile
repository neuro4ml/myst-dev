# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = .
BUILDDIR      = _build

# Path to your SASS source and output directories
SASS_SRC      = ./_themes/two_columns_new/sass/
SASS_OUT      = ./_themes/two_columns_new/static/

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

.PHONY: help Makefile sass

# Target to start the SASS watcher
sass:
	@sass --watch $(SASS_SRC):$(SASS_OUT) &

# Integrate the SASS watcher with the default Sphinx build targets
%: Makefile
	@$(MAKE) sass
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
