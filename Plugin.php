<?php

namespace Kanboard\Plugin\PITM;

use Kanboard\Core\Plugin\Base;
use Kanboard\Plugin\PITM\Model\PasteFileModel;

class Plugin extends Base
{
    public function initialize()
    {
        $this->hook->on('template:layout:css', array('template' => 'plugins/PITM/Assets/css/style.css'));
        $this->hook->on('template:layout:js', array('template' => 'plugins/PITM/Assets/js/PITM.js'));

        $container = $this->container;
        $this->hook->on('model:task:creation:aftersave', function($task_id) use ($container) {
            $model = new PasteFileModel($container);
            $model->moveImagesToTask($task_id);
        });

        $this->route->addRoute('PITM/paste', 'PasteController', 'upload', 'PITM');
    }

    public function getClasses()
    {
        return [
            'Plugin\PITM\Model' => [
                'PasteFileModel'
            ]
        ];
    }

    public function getPluginName()
    {
        return "PasteImageToMarkdown";
    }

    public function getPluginAuthor()
    {
        return 'Tomas Dittmann';
    }

    public function getPluginVersion()
    {
        return '1.0.3';
    }

    public function getPluginDescription()
    {
        return 'enable pasting images to markdown-enbaled textfields';
    }
    
    public function getPluginHomepage()
    {
        return "https://github.com/Chaosmeister/PITM";
    }
}
