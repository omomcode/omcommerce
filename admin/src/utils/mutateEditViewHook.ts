import pluginId from '../pluginId';

/**
 * Checks if the field in the layout's row has the url-image enabled.
 * @param {array} layouts - The layouts in the current content-type
 * @returns {array} - The updated layouts
 */
const mutateLayouts = (layouts : any): Array<any> => {
  return layouts.map((row : any) => {
    return row.reduce((acc: any, field: any) => {
      const hasMapFieldEnabled = field.fieldSchema.pluginOptions?.[pluginId].enabled;
      if (!hasMapFieldEnabled) {
        return [...acc, field];
      }
      return [...acc, {
        ...field,
        fieldSchema: {
          ...field.fieldSchema,
          type: pluginId
        }
      }]
    }, []);
  });
};
/**
 * Behaviours triggered by the 'Admin/CM/pages/EditView/mutate-edit-view-layout' hook.
 */
const mutateEditViewHook = ({layout, query} : any) => {
  const mutateEditLayout = mutateLayouts(layout.contentType.layouts.edit);
  const modifiedLayouts = {
    ...layout.contentType.layouts,
    edit: mutateEditLayout,
  };
  return {
    layout: {
      ...layout,
      contentType: {
        ...layout.contentType,
        layouts: modifiedLayouts,
      }
    },
    query,
  };
};
export default mutateEditViewHook;
