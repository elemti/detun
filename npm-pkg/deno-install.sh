#!/bin/sh
# modified from https://deno.land/x/install@v0.1.2/install.sh

set -e

deno_install="${DENO_INSTALL:-$HOME/.deno}"
bin_dir="$deno_install/bin"
exe="$bin_dir/deno"

if [ ! -d "$bin_dir" ]; then
	mkdir -p "$bin_dir"
fi

gzip -cd ./deno.gz > "$exe"
chmod +x "$exe"

echo "Deno was installed successfully to $exe"
if command -v deno >/dev/null; then
	echo "Run 'deno --help' to get started"
else
	case $SHELL in
	/bin/zsh) shell_profile=".zshrc" ;;
	*) shell_profile=".bash_profile" ;;
	esac
	echo "Manually add the directory to your \$HOME/$shell_profile (or similar)"
	echo "  export DENO_INSTALL=\"$deno_install\""
	echo "  export PATH=\"\$DENO_INSTALL/bin:\$PATH\""
	echo "Run '$exe --help' to get started"
fi
