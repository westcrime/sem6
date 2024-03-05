#!/bin/bash

processed_files=()

search_file() {
    local current_dir="$1"
    shift

    cd "$current_dir" || return

    for file in *; do
        for target_file in "$@"; do
            if [ -f "$file" ] && echo "${processed_files[@]}" | grep -q "$file"; then
                continue
            fi
            
            if [ -f "$file" ] && echo "$file" | grep -Eq "$target_file"; then
                echo "Файл '$target_file' найден: $(realpath "$file");"
                size=$(wc -c < "$file")
                echo "Размер файла: $size B" 
                total_size=$((total_size + size))
                processed_files+=("$file")
                awk '{if(NR>1)print NR-1, $0}' "$file"
            fi
        done
    done

    for subdir in */; do
        if [ -d "$subdir" ]; then
            search_file "$subdir" "$@"
        fi
    done

    cd ..
}

search_file "." "$@"
echo "Общий размер файлов: $total_size B;"
