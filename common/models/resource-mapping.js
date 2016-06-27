module.exports = function(ResourceMapping) {
  ResourceMapping.defineProperty('resourceId', {type: id => require('mongodb').ObjectId('' + id)});

  // Static fields
  const resourceTypes = ['CAMPAIGN', 'LOCATION', 'BANNER', 'BRAND'];
  resourceTypes.forEach(type => {
    ResourceMapping[type] = type;
  });

  ResourceMapping.getResources = (resourceCtx) => {
    // if (!resourceCtx.groupId) {
    //   throw new Error('resourceCtx must contain groupId');
    // }
    // if (!resourceCtx.resourceType) {
    //   throw new Error('resourceCtx must contain resourceType');
    // }
    // let whereOptions = {groupId: resourceCtx.groupId};
    // if (~resourceTypes.indexOf(resourceCtx.resourceType)) {
    //   whereOptions.resourceType = resourceCtx.resourceType;
    // } else {
    //   throw new Error('resourceType must be one of:', resourceTypes.join(', '));
    // }

    return ResourceMapping
      .find({where: resourceCtx, fields: {resourceId: 1}})
      .then(resourceMaps => resourceMaps.map(item => item.resourceId));
  };
};
