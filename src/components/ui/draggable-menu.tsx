import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  link?: string;
  icon?: string;
  status: 'active' | 'inactive';
  order: number;
}

interface MenuGroup {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  order: number;
  menu_items?: MenuItem[];
}

interface SortableMenuItemProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (id: number) => void;
}

function SortableMenuItem({ item, onEdit, onDelete }: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `item-${item.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-normal text-sm">{item.name}</div>
            {item.description && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </div>
            )}
            {item.link && (
              <div className="text-xs text-blue-600 mt-1">
                {item.link}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
          <div className="flex space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                className="h-6 w-6 p-0"
              >
                <span className="sr-only">Edit</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              >
                <span className="sr-only">Delete</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SortableMenuGroupProps {
  group: MenuGroup;
  onEditGroup?: (group: MenuGroup) => void;
  onDeleteGroup?: (id: number) => void;
  onEditItem?: (item: MenuItem) => void;
  onDeleteItem?: (id: number) => void;
  onAddItem?: (groupId: number) => void;
  onReorderItems?: (groupId: number, items: MenuItem[]) => void;
}

function SortableMenuGroup({
  group,
  onEditGroup,
  onDeleteGroup,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onReorderItems,
}: SortableMenuGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState<MenuItem[]>(group.menu_items || []);

  // Update local items when group data changes
  useEffect(() => {
    setItems(group.menu_items || []);
  }, [group.menu_items]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `group-${group.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Item drag end:', { active: active.id, over: over?.id, groupId: group.id });

    // Only handle item-level drags (ignore group-level drags)
    if (active.id.toString().startsWith('item-') && over?.id.toString().startsWith('item-')) {
      if (active.id !== over?.id) {
        setItems((items) => {
          const oldIndex = items.findIndex(item => `item-${item.id}` === active.id);
          const newIndex = items.findIndex(item => `item-${item.id}` === over?.id);

          console.log('Item reorder:', { oldIndex, newIndex, itemsCount: items.length });

          if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            
            // Update order numbers - ensure they are positive integers starting from 1
            const updatedItems = newItems.map((item, index) => ({
              ...item,
              order: Math.max(1, index + 1), // Ensure order is at least 1
            }));

            console.log('Updated items with new order:', updatedItems.map(i => ({ id: i.id, order: i.order })));

            // Call the parent callback
            if (onReorderItems) {
              console.log('Calling onReorderItems for group:', group.id, updatedItems);
              try {
                onReorderItems(group.id, updatedItems);
                console.log('onReorderItems called successfully');
              } catch (error) {
                console.error('Error calling onReorderItems:', error);
              }
            }

            return updatedItems;
          } else {
            console.error('Invalid item indices:', { oldIndex, newIndex });
            return items; // Return unchanged items if indices are invalid
          }
        });
      } else {
        console.log('Same item, no reorder needed');
      }
    } else {
      console.log('Not an item-level drag:', { active: active.id, over: over?.id });
    }
    
    // Prevent event from bubbling up to parent drag context
    event.stopPropagation();
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`mb-4 shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
              {group.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
            <div className="flex space-x-1">
              {onEditGroup && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditGroup(group)}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Edit Group</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Button>
              )}
              {onDeleteGroup && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteGroup(group.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <span className="sr-only">Delete Group</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
        {group.description && (
          <p className="text-sm text-gray-600 ml-8">{group.description}</p>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-normal text-gray-700">Menu Items</h4>
            {onAddItem && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem(group.id)}
                className="h-8 px-3"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Item
              </Button>
            )}
          </div>
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No menu items in this group</p>
              {onAddItem && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddItem(group.id)}
                  className="mt-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
                         <DndContext
               sensors={sensors}
               collisionDetection={closestCenter}
               onDragEnd={handleItemDragEnd}
             >
              <SortableContext
                items={items.map(item => `item-${item.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface DraggableMenuProps {
  groups: MenuGroup[];
  onEditGroup?: (group: MenuGroup) => void;
  onDeleteGroup?: (id: number) => void;
  onEditItem?: (item: MenuItem) => void;
  onDeleteItem?: (id: number) => void;
  onAddItem?: (groupId: number) => void;
  onReorderGroups?: (groups: MenuGroup[]) => void;
  onReorderItems?: (groupId: number, items: MenuItem[]) => void;
}

export function DraggableMenu({
  groups,
  onEditGroup,
  onDeleteGroup,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onReorderGroups,
  onReorderItems,
}: DraggableMenuProps) {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>(groups);

  // Update local groups when props change
  useEffect(() => {
    setMenuGroups(groups);
  }, [groups]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Group drag end:', { active: active.id, over: over?.id });

    // Only handle group-level drags (ignore item-level drags)
    if (active.id.toString().startsWith('group-') && over?.id.toString().startsWith('group-')) {
      if (active.id !== over?.id) {
        const oldIndex = menuGroups.findIndex(group => `group-${group.id}` === active.id);
        const newIndex = menuGroups.findIndex(group => `group-${group.id}` === over?.id);

        console.log('Group reorder:', { oldIndex, newIndex, groups: menuGroups.length });

        if (oldIndex !== -1 && newIndex !== -1) {
          const newGroups = arrayMove(menuGroups, oldIndex, newIndex);
          
          // Update order numbers - ensure they are positive integers starting from 1
          const updatedGroups = newGroups.map((group, index) => ({
            ...group,
            order: Math.max(1, index + 1), // Ensure order is at least 1
          }));

          console.log('Updated groups with new order:', updatedGroups.map(g => ({ id: g.id, order: g.order })));

          setMenuGroups(updatedGroups);

          // Call the parent callback
          if (onReorderGroups) {
            console.log('Calling onReorderGroups with:', updatedGroups);
            try {
              onReorderGroups(updatedGroups);
              console.log('onReorderGroups called successfully');
            } catch (error) {
              console.error('Error calling onReorderGroups:', error);
            }
          } else {
            console.warn('onReorderGroups callback is not provided');
          }
        } else {
          console.error('Invalid indices:', { oldIndex, newIndex });
        }
      } else {
        console.log('Same group, no reorder needed');
      }
    } else {
      console.log('Not a group-level drag:', { active: active.id, over: over?.id });
    }
    
    // Prevent event from bubbling up
    event.stopPropagation();
  };

  const handleItemReorder = (groupId: number, items: MenuItem[]) => {
    setMenuGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, menu_items: items }
          : group
      )
    );

    if (onReorderItems) {
      onReorderItems(groupId, items);
    }
  };

    return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleGroupDragEnd}
      >
        <SortableContext
          items={menuGroups.map(group => `group-${group.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {menuGroups.map((group) => (
            <SortableMenuGroup
              key={group.id}
              group={group}
              onEditGroup={onEditGroup}
              onDeleteGroup={onDeleteGroup}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onAddItem={onAddItem}
              onReorderItems={handleItemReorder}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
