"""
Automatic pathfinder / solver to verify all 10 levels and guarantee they are 100% solvable.
"""

def tile_to_coord(n):
    row = (n - 1) // 5 + 1
    y = row - 1
    pos_in_row = (n - 1) % 5
    x = pos_in_row if row % 2 == 1 else (4 - pos_in_row)
    return x, y

def coord_to_tile(x, y):
    row = y + 1
    pos_in_row = x if row % 2 == 1 else (4 - x)
    return (row - 1) * 5 + pos_in_row + 1

DIRECTIONS = [(1, 0), (0, -1), (-1, 0), (0, 1)] # 0: East, 1: South, 2: West, 3: North

from collections import deque

def solve_level(items_dict, bins_dict, obstacles_set):
    # state: (x, y, dir_idx, inventory_type, tuple_sorted_remaining_items)
    # items_dict: { (x,y): type }
    # bins_dict: { (x,y): type }
    # obstacles_set: { (x,y) }
    
    start_items = tuple(sorted(items_dict.items()))
    start_state = (0, 0, 0, None, start_items)
    
    queue = deque([(start_state, [])])
    visited = {start_state}
    
    while queue:
        (x, y, d, inv, rem_items), path = queue.popleft()
        
        # Win check
        if len(rem_items) == 0 and inv is None:
            return path
            
        rem_dict = dict(rem_items)
        
        # Action 1: Pickup
        if inv is None and (x, y) in rem_dict:
            item_type = rem_dict[(x, y)]
            new_rem = tuple(sorted((k, v) for k, v in rem_dict.items() if k != (x, y)))
            next_state = (x, y, d, item_type, new_rem)
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, path + ['pickup']))
                
        # Action 2: Drop
        if inv is not None and (x, y) in bins_dict and bins_dict[(x, y)] == inv:
            next_state = (x, y, d, None, rem_items)
            if next_state not in visited:
                visited.add(next_state)
                # If this drop cleans all items, return immediately!
                if len(rem_items) == 0:
                    return path + ['drop']
                queue.append((next_state, path + ['drop']))
                
        # Action 3: Turn Right
        next_d = (d + 1) % 4
        next_state = (x, y, next_d, inv, rem_items)
        if next_state not in visited:
            visited.add(next_state)
            queue.append((next_state, path + ['turn_right']))
            
        # Action 4: Turn Left
        next_d = (d - 1) % 4
        next_state = (x, y, next_d, inv, rem_items)
        if next_state not in visited:
            visited.add(next_state)
            queue.append((next_state, path + ['turn_left']))
            
        # Action 5: Move Forward
        dx, dy = DIRECTIONS[d]
        nx, ny = x + dx, y + dy
        if 0 <= nx <= 4 and 0 <= ny <= 4 and (nx, ny) not in obstacles_set:
            next_state = (nx, ny, d, inv, rem_items)
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, path + ['move']))
                
    return None

# Test on 10 levels configuration
test_levels_config = [
    # Level 1
    {"name": "Level 1: Langkah Pertama",
     "items": {3: "organic"}, "bins": {5: "organic"}, "obstacles": []},
     
    # Level 2
    {"name": "Level 2: Belokan Cantik",
     "items": {3: "organic"}, "bins": {8: "organic"}, "obstacles": []},
     
    # Level 3
    {"name": "Level 3: Pilah Botol Plastik",
     "items": {4: "inorganic"}, "bins": {7: "inorganic"}, "obstacles": []},
     
    # Level 4
    {"name": "Level 4: Hindari Rintangan",
     "items": {8: "organic"}, "bins": {3: "organic"}, "obstacles": [2]},
     
    # Level 5
    {"name": "Level 5: Pilah Dua Jenis",
     "items": {2: "organic", 7: "inorganic"}, "bins": {10: "organic", 5: "inorganic"}, "obstacles": [3]},
     
    # Level 6
    {"name": "Level 6: Kekuatan Loop",
     "items": {5: "inorganic"}, "bins": {15: "inorganic"}, "obstacles": []},
     
    # Level 7
    {"name": "Level 7: Pola Berulang",
     "items": {13: "organic"}, "bins": {14: "organic"}, "obstacles": [4, 7]},
     
    # Level 8: Taman Bersih (obstacles moved to 5, 8 to keep path clear)
    {"name": "Level 8: Tiga Sampah di Taman",
     "items": {2: "organic", 10: "organic", 7: "inorganic"}, "bins": {1: "organic", 6: "inorganic"}, "obstacles": [5, 8]},
     
    # Level 9: Efisiensi
    {"name": "Level 9: Efisiensi Algoritma",
     "items": {5: "inorganic", 16: "inorganic"}, "bins": {15: "inorganic"}, "obstacles": [7, 8, 18]},
     
    # Level 10: Misi Akhir
    {"name": "Level 10: Eco Master",
     "items": {3: "organic", 14: "inorganic", 21: "organic", 25: "inorganic"},
     "bins": {5: "organic", 24: "inorganic"},
     "obstacles": [7, 9, 13, 17, 19]}
]

for idx, lvl in enumerate(test_levels_config, 1):
    items = {tile_to_coord(t): v for t, v in lvl["items"].items()}
    bins = {tile_to_coord(t): v for t, v in lvl["bins"].items()}
    obs = {tile_to_coord(t) for t in lvl["obstacles"]}
    solution = solve_level(items, bins, obs)
    if solution:
        print(f"Level {idx} ({lvl['name']}): SOLVABLE! Steps: {len(solution)} | Solution preview: {solution[:5]}...")
    else:
        print(f"Level {idx} ({lvl['name']}): NO SOLUTION FOUND!")
