#!/bin/bash

file_path="$1"
text=$(cat "$file_path")

regex='(^|[.!?]\s+)("?[a-zа-яё])'

result=$(echo "$text" | sed -E "s/$regex/\1\U\2/g")

echo "$result"
