import React, { useEffect, useState } from 'react';
import { Plus, Search, Info, Edit2, Trash2 } from 'lucide-react';
import styles from '../OwnerDashboard.module.css';
import api from '../../../api/axios';

// We map icon string names to the corresponding lucide-react component in the actual table
import * as Icons from 'lucide-react';
import CategoryCreateModal from './CategoryCreateModal';
import PromoStatusDialog from './PromoStatusDialog';

function CategoriesSection({ items = [], categories = [], refreshInventory, loading = false }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [dialog, setDialog] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [draggedCategoryId, setDraggedCategoryId] = useState(null);
    const [localCategories, setLocalCategories] = useState(categories);

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    const categoriesWithCounts = localCategories.map((category) => ({
        ...category,
        itemCount: items.filter((item) => item.category_id === category.id).length,
    }));

    const filteredCategories = categoriesWithCounts.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fallback icon rendering
    const renderIcon = (iconName) => {
        // Simple mapping, since Lucide might not have exact matches for some standard UI icons
        const IconComponent = Icons[iconName] || Icons.Utensils;
        return <IconComponent size={20} className={styles.categoryIconList} />;
    };

    const handleCreateCategory = async ({ name }) => {
        setIsSaving(true);

        try {
            await api.post('/owner/inventory/categories', { name });
            await refreshInventory?.();
            setShowCreateModal(false);
            setDialog({
                type: 'success',
                title: 'Category Created Successfully',
                message: `${name} has been added and is now visible to customers.`,
            });
        } catch (error) {
            console.error('Failed to create category:', error);
            setDialog({
                type: 'error',
                title: 'Action Failed',
                message: "We couldn't create the category. Please check your internet connection or try a different name.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateCategory = async ({ name }) => {
        if (!editingCategory) return;

        setIsSaving(true);

        try {
            await api.put(`/owner/inventory/categories/${editingCategory.id}`, { name });
            await refreshInventory?.();
            setEditingCategory(null);
            setDialog({
                type: 'success',
                title: 'Category Updated Successfully',
                message: `${name} has been updated.`,
            });
        } catch (error) {
            console.error('Failed to update category:', error);
            setDialog({
                type: 'error',
                title: 'Action Failed',
                message: `We couldn't update ${editingCategory.name}. Please try again.`,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (category) => {
        if (!window.confirm(`Delete ${category.name}?`)) return;

        try {
            await api.delete(`/owner/inventory/categories/${category.id}`);
            await refreshInventory?.();
            setDialog({
                type: 'success',
                title: 'Category Deleted',
                message: `${category.name} has been removed.`,
            });
        } catch (error) {
            console.error('Failed to delete category:', error);
            setDialog({
                type: 'error',
                title: 'Action Failed',
                message: `We couldn't delete ${category.name}. Please try again.`,
            });
        }
    };

    const moveCategory = (list, draggedId, targetId) => {
        const draggedIndex = list.findIndex((category) => category.id === draggedId);
        const targetIndex = list.findIndex((category) => category.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
            return list;
        }

        const reordered = [...list];
        const [draggedItem] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedItem);
        return reordered;
    };

    const handleDragStart = (categoryId) => {
        if (isReordering) return;
        setDraggedCategoryId(categoryId);
    };

    const handleDrop = async (targetCategoryId) => {
        if (!draggedCategoryId || draggedCategoryId === targetCategoryId || isReordering) {
            setDraggedCategoryId(null);
            return;
        }

        const previousCategories = localCategories;
        const reorderedCategories = moveCategory(previousCategories, draggedCategoryId, targetCategoryId);

        setLocalCategories(reorderedCategories);
        setDraggedCategoryId(null);
        setIsReordering(true);

        try {
            await api.patch('/owner/inventory/categories/reorder', {
                category_ids: reorderedCategories.map((category) => category.id),
            });
            await refreshInventory?.();
        } catch (error) {
            console.error('Failed to reorder categories:', error);
            setLocalCategories(previousCategories);
            setDialog({
                type: 'error',
                title: 'Reorder Failed',
                message: "We couldn't save the new category order. Please try again.",
            });
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>Categories</h2>
                    <p className={styles.sectionSubtitle}>Organize menu items into clear categories for easier browsing by customers.</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchWrap}>
                        <Search className={styles.searchIcon} size={16} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className={styles.btnSave} onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} style={{ marginRight: '6px' }} /> Add Category
                    </button>
                </div>
            </div>

            <div className={styles.infoBanner}>
                <div className={styles.infoBannerIcon}>
                    <Info size={16} />
                </div>
                <div className={styles.infoBannerText}>
                    <strong>Quick Tip</strong>
                    <p>Categories at the top of this list will appear first in your customer-facing app. We recommend placing your most popular categories (like Burgers or Rice Meals) near the top for better conversion.</p>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Menu Items</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map(cat => (
                            <tr
                                key={cat.id}
                                draggable={!isReordering}
                                onDragStart={() => handleDragStart(cat.id)}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={() => handleDrop(cat.id)}
                                onDragEnd={() => setDraggedCategoryId(null)}
                                style={draggedCategoryId === cat.id ? { opacity: 0.55 } : undefined}
                            >
                                <td>
                                    <div className={styles.categoryNameCell}>
                                        <Icons.GripVertical size={16} className={styles.dragHandle} />
                                        <div className={styles.categoryIconCircle}>
                                            {renderIcon(cat.icon || 'Utensils')}
                                        </div>
                                        <span className={styles.itemTitle}>{cat.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.itemSubtitle}>{cat.itemCount} items</span>
                                </td>
                                <td>
                                    <div className={styles.actionButtonsRight}>
                                        <button
                                            className={styles.iconBtn}
                                            onClick={() => setEditingCategory(cat)}
                                            type="button"
                                            title={`Edit ${cat.name}`}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className={styles.iconBtn}
                                            onClick={() => handleDeleteCategory(cat)}
                                            type="button"
                                            title={`Delete ${cat.name}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredCategories.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>No categories found.</p>
                    </div>
                )}
                {loading && (
                    <div className={styles.emptyState}>
                        <p>Loading categories...</p>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CategoryCreateModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreateCategory}
                    isSaving={isSaving}
                />
            )}

            {editingCategory && (
                <CategoryCreateModal
                    onClose={() => setEditingCategory(null)}
                    onSave={handleUpdateCategory}
                    isSaving={isSaving}
                    title="Edit Category"
                    submitLabel="Save Changes"
                    initialName={editingCategory.name}
                />
            )}

            {dialog && (
                <PromoStatusDialog
                    type={dialog.type}
                    title={dialog.title}
                    message={dialog.message}
                    actionText="Done"
                    onAction={() => setDialog(null)}
                />
            )}
        </div>
    );
}

export default CategoriesSection;
